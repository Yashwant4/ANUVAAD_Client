/*
Copyright 2025 New Vector Ltd.
Copyright 2020 Bruno Windels <bruno@windels.cloud>
Copyright 2020 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import {TemplateView} from "../../general/TemplateView";    
import {Popup} from "../../general/Popup.js";
import {Menu} from "../../general/Menu.js";
import {TimelineView} from "./TimelineView";
import {TimelineLoadingView} from "./TimelineLoadingView.js";
import {MessageComposer} from "./MessageComposer.js";
import {DisabledComposerView} from "./DisabledComposerView.js";
import {AvatarView} from "../../AvatarView.js";
import {CallView} from "./CallView";
import { ErrorView } from "../../general/ErrorView";

export class RoomView extends TemplateView {
    constructor(vm, viewClassForTile) {
        super(vm);
        this._viewClassForTile = viewClassForTile;
        this._optionsPopup = null;
    }
// In src/platform/web/ui/session/room/RoomView.js

    render(t, vm) {
        // This is the language data for our dropdown
        const languages = {
            "en": "English",
            "hi": "हिंदी (Hindi)",
            "mr": "मराठी (Marathi)",
            "as": "অসমীয়া (Assamese)",
            "":"Auto-detect"
        };
        // Get the previously saved language, or default to "en"
        const savedLang = localStorage.getItem("userLanguage") || "en";

        return t.main({className: "RoomView middle"}, [
            t.div({className: "RoomHeader middle-header"}, [
                t.a({className: "button-utility close-middle", href: vm.closeUrl, title: vm.i18n`Close room`}),
                t.view(new AvatarView(vm, 32)),
                t.div({className: "room-description"}, [
                    t.h2(vm => vm.name),
                ]),

                
                t.div({ className: "language-selector-wrapper" }, [
                    t.label({ for: "language-select" }, "My Language:"),
                    t.select({
                        id: "language-select",
                        // This function runs every time the user picks a new language
                        onchange: event => {
                            localStorage.setItem("userLanguage", event.target.value);
                        }
                    }, Object.entries(languages).map(([code, name]) => {
                        // Create an <option> for each language
                        return t.option({
                            value: code,
                            // This makes sure the saved language is selected on load
                            selected: code === savedLang
                        }, name);
                    }))
                ]),

                t.button({
                    className: "button-utility room-options",
                    "aria-label":vm.i18n`Room options`,
                    onClick: evt => this._toggleOptionsMenu(evt)
                })
            ]),
            t.div({className: "RoomView_body"}, [
                t.if(vm => vm.errorViewModel, t => t.div({className: "RoomView_error"}, t.view(new ErrorView(vm.errorViewModel)))),
                t.mapView(vm => vm.callViewModel, callViewModel => callViewModel ? new CallView(callViewModel) : null),
                t.mapView(vm => vm.timelineViewModel, timelineViewModel => {
                    return timelineViewModel ?
                        new TimelineView(timelineViewModel, this._viewClassForTile) :
                        new TimelineLoadingView(vm);    // vm is just needed for i18n
                }),
                t.mapView(vm => vm.composerViewModel, composerViewModel => {
                    switch (composerViewModel?.kind) {
                        case "composer":
                            return new MessageComposer(vm.composerViewModel, this._viewClassForTile);
                        case "disabled":
                            return new DisabledComposerView(vm.composerViewModel);
                    }
                }),
            ])
        ]);
    }
    
    _toggleOptionsMenu(evt) {
        if (this._optionsPopup && this._optionsPopup.isOpen) {
            this._optionsPopup.close();
        } else {
            const vm = this.value;
            const options = [];
            options.push(Menu.option(vm.i18n`Room details`, () => vm.openDetailsPanel()));
            if (vm.features.calls) {
                options.push(Menu.option(vm.i18n`Start call`, () => vm.startCall()));
            }
            if (vm.canLeave) {
                options.push(Menu.option(vm.i18n`Leave room`, () => this._confirmToLeaveRoom()).setDestructive());
            }
            if (vm.canForget) {
                options.push(Menu.option(vm.i18n`Forget room`, () => vm.forgetRoom()).setDestructive());
            }
            if (vm.canRejoin) {
                options.push(Menu.option(vm.i18n`Rejoin room`, () => vm.rejoinRoom()));
            }
            if (!options.length) {
                return;
            }
            this._optionsPopup = new Popup(new Menu(options));
            this._optionsPopup.trackInTemplateView(this);
            this._optionsPopup.showRelativeTo(evt.target, 10);
        }
    }

    _confirmToLeaveRoom() {
        if (confirm(this.value.i18n`Are you sure you want to leave "${this.value.name}"?`)) {
            this.value.leaveRoom();
        }
    }
}
