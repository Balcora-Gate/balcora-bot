# balcora-bot

Balcora Bot (aka BB) is a Discord bot which can parse various commands. It's designed to give the community easy access to tools and data which are otherwise inaccessible, in a command environment and with easy syntax.

<p align="center"><img src="https://i.imgur.com/uMvwk6r.png" alt="BALCORA" /></p>

---

## Usage

BB responds to certain commands, which must be prefixed with the string `bb `. For example:

```
bb info -n hgn_interceptor -t ship --a
```

Here, BB knows to listen to this message due to the prefix.

You can also see the general syntax for BB command flags/args:

Args have a name, and also require a value:
```
-<arg-name> <value>
```
Examples:

```
-n hgn_interceptor
-name hgn_interceptor
-cat wepn
```
Flags just have names (double hyphen prefix):
```
--<flag-name>
```
Examples:

```
--a
--all
```

## Commands

BB currently only has one command:

### info:

Possible args:

| Arg      | Aliases                      | Description                                                                                                              |
|----------|------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `-name` | `-n`                         | Name of the entity you're trying to find. It doesn't have to be the whole name; any partial matches are also returned.   |
| `-type` | `-t`, `-category`, `-cat`, `-c` | The entity type. Can be one of three values: `ship`, `wepn`, or `subs`, for Ships, Weapons, and Subsystems respectively. |

Possible flags:

| Flag  | Aliases | Description                                                                                                                                                                                        |
|-------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--all` | `--a`     | Instead of a summary, BB will fetch and format the whole entity data. This will be stored on [glot.io](https://glot.io/) where you can view the data in verbose, summarized, and raw json formats. |

Example:
```
bb info -n kus_ionc -t wepn
```
The above command asks for any weapons who's name _contains_ `'kus_ionc'`.

BB will return a summary of the entities's info, along with reference links to [balcora-gate](https://www.balcora-gate.com/#/data/reference). If the `--all` flag is specified, the info will be stored in three formats on [glot.io](https://glot.io/) and a link to the paste files is given.

Balcora data includes usage information for weapons and subsystems - you can see which ships use a certain weapon easily, for example.