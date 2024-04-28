function executeScripts(html) {
    const parsedHTML = new DOMParser().parseFromString(html, "text/html");

    parsedHTML.querySelectorAll("script").forEach((script) => {
        const scriptContent = script.textContent;
        const scriptFunction = new Function(scriptContent);
        scriptFunction();
    });
}

function loadComponent(componentName, dom, data = {}) {
    if (!(dom instanceof Element))
        throw new Error("Invalid DOM element provided!");

    fetch(`assets/html/components/${componentName}.html`)
        .then((response) => response.text())
        .then((html) => {
            if (Object.keys(data) !== 0) {
                html = replacePlaceholders(html, data);
            }
            // Assuming you have a specific container in your main.html
            executeScripts(html);
            dom.outerHTML = html;
        });
}

function replacePlaceholders(html, data) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
            html = html.replace(placeholder, formatXData(data[key]));
        }
    }
    return html;
}

function formatXData(data) {
    let output = "";

    switch (typeof data) {
        case "object": {
            output = `{ ${Object.entries(data)
                .map(
                    ([key, value]) =>
                        `${key.replace(/'/g, "\\'")}: '${
                            typeof value === "string"
                                ? value.replace(/'/g, "\\'")
                                : value
                        }'`
                )
                .join(", ")} }`;
            break;
        }
        case "string": {
            output = data.replace(/'/g, "\\'");
            //"'" + data.replace(/'/g, "\\'") + "'";
            break;
        }
        default: {
            output = data;
            break;
        }
    }

    return output;
}
