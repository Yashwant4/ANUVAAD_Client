/*
Copyright 2025 New Vector Ltd.
Copyright 2020 Bruno Windels <bruno@windels.cloud>

SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import {tag, text} from "../../../general/html";
import {BaseMessageView} from "./BaseMessageView.js";
import {ReplyPreviewError, ReplyPreviewView} from "./ReplyPreviewView.js";
export class TextMessageView extends BaseMessageView {
   /* renderMessageBody(t, vm) {
    // This log proves the new version is running.
    console.log("Running the final version of renderMessageBody from 10:00 PM");

    const time = t.time({className: {hidden: !vm.time}}, vm.time);
    const container = t.div({
        className: {
            "Timeline_messageBody": true,
            statusMessage: vm => vm.shape === "message-status",
        }
    }, t.mapView(vm => vm.replyTile, replyTile => {
        if (this._isReplyPreview) { return null; }
        else if (vm.isReply && !replyTile) { return new ReplyPreviewError(); }
        else if (replyTile) { return new ReplyPreviewView(replyTile, this._viewClassForTile); }
        else { return null; }
    }));

    const shouldRemove = (element) => element?.nodeType !== Node.COMMENT_NODE && element.className !== "ReplyPreviewView";

    t.mapSideEffect(vm => vm.body, body => {
        while (shouldRemove(container.lastChild)) { container.removeChild(container.lastChild); }
        for (const part of body.parts) { container.appendChild(renderPart(part)); }
        container.appendChild(time);
    });

    // Look for the content inside vm._entry
    const content = vm._entry?.content;

    // Only run if content exists
    if (content) {
        const senderLang = content["dev.yourdomain.language"];
        const myLang = "hi";

        if (senderLang && senderLang !== myLang) {
            
            const translationContainer = t.div({className: "translated-text"});
            const translateButton = t.button(
                {
                    className: "translate-button",
                    onclick: () => {
                        const originalBody = content.body;
                        const fakeTranslation = `[Hindi Translation]: ${originalBody}`;
                        translationContainer.textContent = fakeTranslation;
                    }
                },
                "Translate"
            );
            
            container.appendChild(translateButton);
            container.appendChild(translationContainer);
        }
    }
-----------------------------------------------------------------------------------------------------
    renderMessageBody(t, vm) {
        const time = t.time({className: {hidden: !vm.time}}, vm.time);
        const container = t.div({
            className: {
                "Timeline_messageBody": true,
                statusMessage: vm => vm.shape === "message-status",
            }
        }, t.mapView(vm => vm.replyTile, replyTile => {
            if (this._isReplyPreview) { return null; }
            else if (vm.isReply && !replyTile) { return new ReplyPreviewError(); }
            else if (replyTile) { return new ReplyPreviewView(replyTile, this._viewClassForTile); }
            else { return null; }
        }));

        const shouldRemove = (element) => element?.nodeType !== Node.COMMENT_NODE && element.className !== "ReplyPreviewView";

        t.mapSideEffect(vm => vm.body, body => {
            while (shouldRemove(container.lastChild)) { container.removeChild(container.lastChild); }
            for (const part of body.parts) { container.appendChild(renderPart(part)); }
            container.appendChild(time);
        });

        const content = vm._entry?.content;

        if (content) {
            // We need this map to get the full language name (e.g., "Assamese") from its code ("as")
            const languages = {
                "en": "English",
                "hi": "Hindi",
                "mr": "Marathi",
                "as": "Assamese"
            };
            
            // CHANGE #1: Read the receiver's language from localStorage instead of hardcoding it
            const myLang = localStorage.getItem("userLanguage") || "en";
            const senderLang = content["dev.yourdomain.language"];

            if (senderLang && senderLang !== myLang) {
                
                const translationContainer = t.div({className: "translated-text"});
                const translateButton = t.button(
                    {
                        className: "translate-button",
                        onclick: () => {
                            // CHANGE #2: Make the translation text dynamic
                            const originalBody = content.body;
                            // Look up the full name of the target language
                            const targetLangName = languages[myLang] || myLang;
                            const fakeTranslation = `[${targetLangName} Translation]: ${originalBody}`;
                            translationContainer.textContent = fakeTranslation;
                        }
                    },
                    "Translate"
                );
                
                container.appendChild(translateButton);
                container.appendChild(translationContainer);
            }
        }
        

    
        

        return container;
    }
}
*/
renderMessageBody(t, vm) {
    const time = t.time({className: {hidden: !vm.time}}, vm.time);
    const container = t.div({
        className: {
            "Timeline_messageBody": true,
            statusMessage: vm => vm.shape === "message-status",
        }
    }, t.mapView(vm => vm.replyTile, replyTile => {
        if (this._isReplyPreview) { return null; }
        else if (vm.isReply && !replyTile) { return new ReplyPreviewError(); }
        else if (replyTile) { return new ReplyPreviewView(replyTile, this._viewClassForTile); }
        else { return null; }
    }));

    const shouldRemove = (element) => element?.nodeType !== Node.COMMENT_NODE && element.className !== "ReplyPreviewView";

    t.mapSideEffect(vm => vm.body, body => {
        while (shouldRemove(container.lastChild)) { container.removeChild(container.lastChild); }
        for (const part of body.parts) { container.appendChild(renderPart(part)); }
        container.appendChild(time);
    });

    const content = vm._entry?.content;

    if (content) {
        const myLang = localStorage.getItem("userLanguage") || "en";
        // The sender's language might be undefined if coming from a standard client
        const senderLang = content["dev.yourdomain.language"];

        // The button should appear if the languages are different, OR if the sender's language is unknown.
        // This condition cleverly handles both cases.
        if (senderLang !== myLang) {
            
            const translationContainer = t.div({className: "translated-text"});
            const translateButton = t.button(
                {
                    className: "translate-button",
                    onclick: async () => {
                        let sourceLanguage = senderLang; // Start with the language from the tag
                        
                        try {
                            // --- THIS IS THE NEW DETECTION LOGIC ---
                            // If the language tag is missing, we must detect it first.
                            if (!sourceLanguage) {
                                translationContainer.textContent = "Detecting language...";
                                
                                const detectResponse = await fetch("http://127.0.0.1:5000/detect_language", {
                                    method: "POST",
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({ text: content.body }),
                                });

                                const detectData = await detectResponse.json();
                                if (detectData.language_code) {
                                    sourceLanguage = detectData.language_code;
                                } else {
                                    // If detection fails, stop here.
                                    throw new Error(detectData.error || "Could not detect language.");
                                }
                            }
                            
                            // If after detection, the language is the same, no need to translate.
                            if (sourceLanguage === myLang) {
                                translationContainer.textContent = "Language is already the same.";
                                return;
                            }

                            // --- Now, proceed with translation ---
                            translationContainer.textContent = "Translating...";
                            
                            const translateResponse = await fetch("http://127.0.0.1:5000/translate", {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({
                                    text: content.body,
                                    source_lang: sourceLanguage,
                                    target_lang: myLang
                                }),
                            });

                            const translateData = await translateResponse.json();

                            if (translateData.translated_text) {
                                translationContainer.textContent = translateData.translated_text;
                            } else {
                                throw new Error(translateData.error || "Unknown translation error.");
                            }
                        } catch (err) {
                            translationContainer.textContent = `Error: ${err.message}`;
                            console.error("API Integration error:", err);
                        }
                    }
                },
                "Translate"
            );
            
            container.appendChild(translateButton);
            container.appendChild(translationContainer);
        }
    }
    
    return container;
}
}

function renderList(listBlock) {
    const items = listBlock.items.map(item => tag.li(renderParts(item)));
    const start = listBlock.startOffset;
    if (start) {
        return tag.ol({ start }, items);
    } else {
        return tag.ul(items);
    }
}

function renderImage(imagePart) {
    const attributes = { src: imagePart.src };
    if (imagePart.width) { attributes.width = imagePart.width }
    if (imagePart.height) { attributes.height = imagePart.height }
    if (imagePart.alt) { attributes.alt = imagePart.alt }
    if (imagePart.title) { attributes.title = imagePart.title }
    return tag.img(attributes);
}

function renderPill(pillPart) {
    // The classes and structure are borrowed from avatar.js;
    // We don't call renderStaticAvatar because that would require
    // an intermediate object that has getAvatarUrl etc.
    const classes = `avatar size-12 usercolor${pillPart.avatarColorNumber}`;
    const avatar = tag.div({class: classes}, text(pillPart.avatarInitials));
    const children = renderParts(pillPart.children);
    children.unshift(avatar);
    return tag.a({class: "pill", href: pillPart.href, rel: "noopener", target: "_blank"}, children);
}

function renderTable(tablePart) {
    const children = [];
    if (tablePart.head) {
        const headers = tablePart.head
            .map(cell => tag.th(renderParts(cell)));
        children.push(tag.thead(tag.tr(headers)))
    }
    const rows = [];
    for (const row of tablePart.body) {
        const data = row.map(cell => tag.td(renderParts(cell)));
        rows.push(tag.tr(data));
    }
    children.push(tag.tbody(rows));
    return tag.table(children);
}

/**
 * Map from part to function that outputs DOM for the part
 */
const formatFunction = {
    header: headerBlock => tag["h" + Math.min(6,headerBlock.level)](renderParts(headerBlock.inlines)),
    codeblock: codeBlock => tag.pre(tag.code(text(codeBlock.text))),
    table: tableBlock => renderTable(tableBlock),
    code: codePart => tag.code(text(codePart.text)),
    text: textPart => text(textPart.text),
    link: linkPart => tag.a({href: linkPart.url, className: "link", target: "_blank", rel: "noopener" }, renderParts(linkPart.inlines)),
    pill: renderPill,
    format: formatPart => tag[formatPart.format](renderParts(formatPart.children)),
    rule: () => tag.hr(),
    list: renderList,
    image: renderImage,
    newline: () => tag.br()
};

function renderPart(part) {
    const f = formatFunction[part.type];
    if (!f) {
        return text(`[unknown part type ${part.type}]`);
    }
    return f(part);
}

function renderParts(parts) {
    return Array.from(parts, renderPart);
}
