# Advent of Code Solutions

This is my work for [Advent of Code](https://adventofcode.com/)

## Run a Solution

This command will run a specific solution.

```CMD
npm run day <yyyy> <dd> [time]
```

### Description

**yyyy**: The 4 digit year of the solution being run.

**dd**: The 2 digit day of the solution being run.

### Options

**time**: Computes the execution time of the solution and displays it after the results are displayed

## Setup

Input files are stored in a private submodule that is referenced by git in the project. 

After cloning the repo run these commands to setup the submodule

[More about git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

```CMD
git submodule init
git submodule update
```
## Input files

The solution runner expects that all input files will be in the location `./AOCPuzzlesInputs/{yyyy}/Day{dd}_input.txt`. In this template `{yyyy}` is the 4 digit year and `{dd}` is the 2 digit day.
