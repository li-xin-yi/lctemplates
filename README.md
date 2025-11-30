# LC Templates

My personal summerized LeetCode Python templates.

![Python](https://img.shields.io/badge/Python-3-blue)
[![Documentation](https://img.shields.io/readthedocs/lctemplates?style=flat-square)](https://lctemplates.readthedocs.io/)
[![Twitter Follow](https://img.shields.io/twitter/follow/yangzhou301)](https://twitter.com/yangzhou301) 
[![LeetCode user cascandaliato](https://img.shields.io/badge/dynamic/json?style=flat-square&labelColor=black&color=%23ffa116&label=Solved&query=solvedOverTotal&url=https%3A%2F%2Fleetcode-badge.vercel.app%2Fapi%2Fusers%2Fxy-li&logo=leetcode&logoColor=yellow)](https://leetcode.com/u/xy-li/)

## TODO

- [x] Binary Search
- [ ] Prefix Sum
- [ ] Intervals

## Building Documentation Locally

This project uses Sphinx for documentation generation. To build the documentation locally:

### 1. Set up the virtual environment

Create and activate a virtual environment:

```bash
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

### 2. Install dependencies

Install the required packages from the documentation requirements:

```bash
pip install -r docs/requirements.txt
```

### 3. Build the documentation

Navigate to the `docs` directory and build:

```bash
cd docs
make html
```

The generated HTML documentation will be available in `docs/build/html/`. Open `docs/build/html/index.html` in your browser to view it.

### Alternative: Using sphinx-build directly

You can also use `sphinx-build` directly:

```bash
cd docs
sphinx-build -b html source build/html
```

### Clean build

To clean the build directory and rebuild from scratch:

```bash
cd docs
make clean
make html
```
