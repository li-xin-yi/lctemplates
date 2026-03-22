from textwrap import dedent

# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'LCtemplates'
copyright = '2026, Xinyi Li'
author = 'Xinyi Li'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'alabaster'

html_theme_options = {
    'description': 'Algorithm templates & notes for competitive programming',
    'github_user': 'li-xin-yi',
    'github_repo': 'lctemplates',
    'github_button': True,
    'github_type': 'star',
    'fixed_sidebar': True,
    'show_powered_by': False,
    'page_width': '100%',
    'sidebar_width': '260px',
    'body_text': '#111111',
    'link': '#0066ff',
    'link_hover': '#0052cc',
    'sidebar_link': '#333333',
    'sidebar_header': '#111111',
    'sidebar_text': '#555555',
    'sidebar_hr': '#e8e8e8',
    'pre_bg': '#f3f3f3',
    'note_bg': '#f0f7ff',
    'note_border': '#0066ff',
    'hint_bg': '#f0faf3',
    'hint_border': '#1a7f37',
    'warning_bg': '#fffbf0',
    'warning_border': '#e6a817',
    'danger_bg': '#fff5f5',
    'danger_border': '#e53e3e',
    'font_family': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    'head_font_family': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    'code_font_family': "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
    'code_font_size': '0.83em',
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# Custom CSS and JS files
html_css_files = [
    'floating-toc.css',
    'custom-theme.css',
]

html_js_files = [
    'floating-toc.js',
]

extensions = ['myst_parser', 'sphinx.ext.viewcode', 
              'sphinx_copybutton', "sphinxcontrib.mermaid", "sphinx_design"]

myst_enable_extensions = ["linkify", "dollarmath", "amsmath", "colon_fence"]

master_doc = 'index'

utterances_config = {
    "repo": "li-xin-yi/lctemplates",
    "issue-term": "pathname",
    "label": "comment",
    "theme": "github-light",
    "crossorigin": "anonymous",
}


def setup(app):
    utterances_js = dedent(
        f"""
        var commentsRunWhenDOMLoaded = cb => {{
            if (document.readyState !== "loading") {{
                cb();
            }} else if (document.addEventListener) {{
                document.addEventListener("DOMContentLoaded", cb);
            }} else {{
                document.attachEvent("onreadystatechange", function() {{
                    if (document.readyState === "complete") cb();
                }});
            }}
        }};

        var addUtterances = () => {{
            if (document.querySelector(".utterances")) {{
                return;
            }}

            var host = document.querySelector("main .body section")
                || document.querySelector("main .body")
                || document.querySelector("div.body")
                || document.querySelector("article[role='main']")
                || document.querySelector("main");

            if (!host) {{
                return;
            }}

            var container = document.createElement("div");
            container.className = "utterances-comments";

            var script = document.createElement("script");
            script.src = "https://utteranc.es/client.js";
            script.async = true;
            script.crossOrigin = "{utterances_config['crossorigin']}";
            script.setAttribute("repo", "{utterances_config['repo']}");
            script.setAttribute("issue-term", "{utterances_config['issue-term']}");
            script.setAttribute("label", "{utterances_config['label']}");
            script.setAttribute("theme", "{utterances_config['theme']}");

            container.appendChild(script);
            host.appendChild(container);
        }};

        commentsRunWhenDOMLoaded(addUtterances);
        """
    )
    app.add_js_file(None, body=utterances_js)
