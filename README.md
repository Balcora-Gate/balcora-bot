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

See all of BB's commands [here](https://github.com/Balcora-Gate/balcora-bot/tree/master/docs).
Or, use the `bb help` command in chat.