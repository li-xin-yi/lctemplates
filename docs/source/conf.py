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
copyright = '2022, Xinyi Li'
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
              'sphinx_copybutton', "sphinx_comments", "sphinxcontrib.mermaid", "sphinx_design"]

myst_enable_extensions = ["linkify", "dollarmath", "amsmath", "colon_fence"]

master_doc = 'index'

comments_config = {
    "utterances": {
        "repo": "li-xin-yi/lctemplates",
        "optional": "config",
        "issue-term": "pathname",
        "label": "comment",
        "theme": "github-light",
    }
}
