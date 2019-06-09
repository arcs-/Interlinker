# Interlinker

Enables or disables checkboxes, input, etc. (or adds a class) depending on the state of other checkboxes or other inputs (by id).

Inputs other than checkboxes and radio buttons are "checked" if they are valid.

## Initialize
```
<script src="interlinker.js"></script>
<script>Interlinker.index()</script>
```

## Examples
(they aren't necessarily good examples and only illustrate the concept)

```
<!-- simple dependecy -->
<input type="checkbox" id="cake" /> I'd like cake
<input type="checkbox" id="candles" depends="cake" /> I'd like it with candles

<!-- multi dependecy -->
<input type="checkbox" id="sign" depends="[cake,candles]">I'd like it with a sign

<!-- inverted dependecy -->
<input type="checkbox" id="ice_cream" depends="!cake" />I'd like ice cream

```

If you add `depends` on anything else than inputs `the class `disabled` will be applied to it

```
<input type="checkbox" id="cake" /> I'd like cake
<img src="cake.png" id="cake" />

<style>
img.disabled { display: none }
</style>
```
