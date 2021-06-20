# landsoul

Brief things to operate Elements

# examples

```javascript
landsoul(document.querySelectorAll('p'))('className', 'landsoul-class')('innerHTML', 'clear')('onclick', () => alert('?'));
landsoul
    .proxy(document.querySelectorAll('p'))
    .className('landsoul-class')
    .innerHTML('clear')
    .onclick(() => alert('?'));
```
