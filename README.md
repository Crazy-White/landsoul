# landsoul

Brief things to operate Elements

# examples

```javascript
landsoul.select('p')('className', 'landsoul-class')('innerHTML', 'clear')('onclick', () => alert('?'));
landsoul.proxy
    .select('#id')
    .className('landsoul-class')
    .innerHTML('clear')
    .onclick(() => alert('?'));
```
