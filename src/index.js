
console.log('Some Javascript Code');

const testMerge = (a, b) =>  [...a, ...b];
const testMergeObjects = (a, b) => ({...a, ...b});

window.addEventListener('load', function() {
    let windowBlock = document.querySelector('.window');
    windowBlock.innerHTML = '<h2>Script works!</h2>';
});

console.log(testMerge([1, 2, 3], [4, 5]));
console.log(testMergeObjects({
    a: 'Letter A',
    5: 'Some key',
    b: 'Letter B',
}, {
    c: 'Some stuff',
    d: 87,
    e: 88,
}))