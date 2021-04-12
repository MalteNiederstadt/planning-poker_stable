#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import distutils
import subprocess
from os.path import dirname, join

from setuptools import find_packages, setup


def read(*args):
    return open(join(dirname(__file__), *args)).read()


class ToxTestCommand(distutils.cmd.Command):
    """Distutils command to run tests via tox with 'python setup.py test'.

    Please note that in our standard configuration tox uses the dependencies in
    `requirements/dev.txt`, the list of dependencies in `tests_require` in
    `setup.py` is ignored!

    See https://docs.python.org/3/distutils/apiref.html#creating-a-new-distutils-command
    for more documentation on custom distutils commands.
    """
    description = "Run tests via 'tox'."
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        self.announce("Running tests with 'tox'...", level=distutils.log.INFO)
        return subprocess.call(['tox'])


exec(read('planning_poker', 'version.py'))

classifiers = """\
# The next line is important: it prevents accidental upload to PyPI!
Private :: Do Not Upload
Development Status :: 2 - Pre-Alpha
Programming Language :: Python
Programming Language :: Python :: 2.7
Framework :: Django
Framework :: Django :: 1.4
Framework :: Django :: 1.6
Intended Audience :: Developers
License :: Other/Proprietary License
#Operating System :: Microsoft :: Windows
Operating System :: POSIX
#Operating System :: MacOS :: MacOS X
Topic :: Internet
"""

install_requires = [
    # 'six',
]

tests_require = [
    'coverage',
    'flake8',
    'pydocstyle',
    'pylint',
    'pytest-django',
    'pytest-pep8',
    'pytest-cov',
    'pytest-pythonpath',
    'pytest',
]

setup(
    name='Planning Poker',
    version=__version__,  # noqa
    description='A Django app which allows teams to perform a remote planning poker session',
    long_description=read('README.rst'),
    author='Rheinwerk Webteam',
    author_email='webteam@rheinwerk-verlag.de',
    maintainer='Rheinwerk Verlag GmbH Webteam',
    maintainer_email='webteam@rheinwerk-verlag.de',
    url='https://gitlab.intern.rheinwerk.de/rheinwerk/planning-poker',
    license='Proprietary',
    classifiers=[c.strip() for c in classifiers.splitlines()
                 if c.strip() and not c.startswith('#')],
    packages=find_packages(include=['planning_poker*']),
    include_package_data=True,
    test_suite='tests',
    install_requires=install_requires,
    tests_require=tests_require,
    cmdclass={
        'test': ToxTestCommand,
    }
)
