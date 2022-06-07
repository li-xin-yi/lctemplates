import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="lctemplates",
    version="0.0.0",
    author="Xinyi Li",
    description="A personal template library for LeetCode",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages()
)