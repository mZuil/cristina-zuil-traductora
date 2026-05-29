/**
 * Convert a Strapi "Blocks" (rich-text) field value into an HTML string.
 *
 * Supports the common Strapi block node types:
 *   - paragraph
 *   - heading (level 1-6)
 *   - list (ordered / unordered) with list-item children
 *   - quote
 *   - code
 *   - link
 *   - image
 *   - text leaves with bold / italic / underline / strikethrough / code marks
 *
 * Pass the result to <AText html={...} /> (which uses `set:html`).
 *
 * NOTE: Output is HTML-escaped for text content, so it is safe to render
 * even if editors paste characters like `<`, `>`, or `&`.
 */

type TextNode = {
    type?: "text";
    text?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
};

type LinkNode = {
    type: "link";
    url: string;
    children: BlockChild[];
};

type BlockChild = TextNode | LinkNode;

type BlockNode =
    | { type: "paragraph"; children: BlockChild[] }
    | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: BlockChild[] }
    | {
          type: "list";
          format: "ordered" | "unordered";
          children: { type: "list-item"; children: BlockChild[] }[];
      }
    | { type: "quote"; children: BlockChild[] }
    | { type: "code"; children: BlockChild[] }
    | {
          type: "image";
          image: { url: string; alternativeText?: string; width?: number; height?: number };
      };

const escape = (str: string): string =>
    str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const renderTextNode = (node: TextNode): string => {
    let out = escape(node.text ?? "");

    // Preserve newlines inside a single text leaf
    out = out.replace(/\n/g, "<br />");

    if (node.code) out = `<code>${out}</code>`;
    if (node.bold) out = `<strong>${out}</strong>`;
    if (node.italic) out = `<em>${out}</em>`;
    if (node.underline) out = `<u>${out}</u>`;
    if (node.strikethrough) out = `<s>${out}</s>`;

    return out;
};

const renderInline = (children: BlockChild[] = []): string =>
    children
        .map((child) => {
            if ((child as LinkNode).type === "link") {
                const link = child as LinkNode;
                const url = escape(link.url ?? "");
                const isExternal = /^https?:\/\//i.test(link.url ?? "");
                const rel = isExternal ? ' rel="noopener noreferrer"' : "";
                const target = isExternal ? ' target="_blank"' : "";
                return `<a href="${url}"${target}${rel}>${renderInline(link.children)}</a>`;
            }
            return renderTextNode(child as TextNode);
        })
        .join("");

export function blocksToHtml(blocks: unknown): string {
    if (!Array.isArray(blocks)) return "";

    return (blocks as BlockNode[])
        .map((block) => {
            switch (block.type) {
                case "paragraph":
                    return `<p>${renderInline(block.children)}</p>`;

                case "heading": {
                    const level = Math.min(Math.max(block.level ?? 2, 1), 6);
                    return `<h${level}>${renderInline(block.children)}</h${level}>`;
                }

                case "list": {
                    const tag = block.format === "ordered" ? "ol" : "ul";
                    const items = (block.children ?? [])
                        .map(
                            (item) =>
                                `<li>${renderInline(item.children ?? [])}</li>`,
                        )
                        .join("");
                    return `<${tag}>${items}</${tag}>`;
                }

                case "quote":
                    return `<blockquote>${renderInline(block.children)}</blockquote>`;

                case "code":
                    return `<pre><code>${renderInline(block.children)}</code></pre>`;

                case "image": {
                    const src = escape(block.image?.url ?? "");
                    const alt = escape(block.image?.alternativeText ?? "");
                    const w = block.image?.width
                        ? ` width="${block.image.width}"`
                        : "";
                    const h = block.image?.height
                        ? ` height="${block.image.height}"`
                        : "";
                    return `<img src="${src}" alt="${alt}"${w}${h} loading="lazy" />`;
                }

                default:
                    return "";
            }
        })
        .join("");
}
