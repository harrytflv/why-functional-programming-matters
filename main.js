function tolist(array) {
    if (array.length == 0) {
        return null
    }
    return {
        obj: array[0],
        list: tolist(array.slice(1))
    }
}

function fromlist(list) {
    if (list == null) {
        return []
    }
    foo = fromlist(list.list)
    foo.unshift(list.obj)
    return foo
}

function cons(obj, list) {
    return {
        obj: obj,
        list: list
    }
}

console.log("CHAPTER 3")
console.log()

function foldr(f, x) {
    return function(list) {
        if (list == null) {
            return x
        }
        return f(list.obj, foldr(f, x)(list.list))
    }
}

function product(list) {
    return foldr(multiply, 1)(list)
}

function multiply(a, b) {
    return a*b
}

console.log("product(tolist([1, 2, 3]))")
console.log(product(tolist([1, 2, 3])))
console.log()

function anytrue(list) {
    return foldr(or, false)(list)
}

function or(a, b) {
    return a||b
}

console.log("anytrue(tolist([true, false, false]))")
console.log(anytrue(tolist([true, false, false])))
console.log()

function length(list) {
    return foldr(count, 0)(list)
}

function count(a, n) {
    return n+1
}

console.log("length(tolist([1, 2, 3]))")
console.log(length(tolist([1, 2, 3])))
console.log()

function doubleall(list) {
    return map(double)(list)
}

function map(f) {
    return foldr(dot(cons, f), null)
}

function double(n) {
    return 2*n
}

function fandcons(f) {
    return function(el, list){
        return cons(f(el), list)
    }
}

function dot(f1, f2) {
    return function(el, list){
        return f1(f2(el), list)
    }
}

console.log("fromlist(doubleall(tolist([1, 2, 3])))")
console.log(fromlist(doubleall(tolist([1, 2, 3]))))
console.log()

function sum(list) {
    return foldr(add, 0)(list)
}

function add(a, b) {
    return a+b
}

console.log("sum(tolist([1, 2, 3]))")
console.log(sum(tolist([1, 2, 3])))
console.log()

console.log("CHAPTER 4")
console.log()

function next(n) {
    return function(x) {
        return (x+n/x)/2
    }
}

// FIXME: somehow lazy eval did not work, so depth is needed
function repeat(f, a, depth) {
    if (depth >= 100) {
        return cons(a, null)
    }
    return cons(a, repeat(f, f(a), depth+1))
}

function within(eps, aandb) {
    if (aandb.list == null || Math.abs(aandb.obj - aandb.list.obj) <= eps)  {
        return aandb.obj
    }
    return within(eps, aandb.list)
}

function sqrt(a0, eps, n) {
    return within(eps, repeat(next(n), a0, 0))
}

console.log("sqrt(2, 1, 4)")
console.log(sqrt(2, 0.01, 10))
console.log()

function easydiff(f, x) {
    return function(h) {
        return (f(x+h)-f(x))/h
    }
}

function differentiate(h0, f, x) {
    return map(easydiff(f, x))(repeat(halve, h0, 0))
}

function halve(x) {
    return x/2
}

function xplus1(x) {
    return x+1
}

function square(x) {
    return x*x
}

console.log("within(0.01, differentiate(1, xplus1, 1))")
console.log(within(0.01, differentiate(1, xplus1, 1)))
console.log("within(0.01, differentiate(1, square, 1))")
console.log(within(0.01, differentiate(1, square, 1)))
console.log()

function easyintegrate(f, a, b) {
    return (f(a)+f(b))*(b-a)/2
}

// FIXME: somehow lazy eval did not work, so depth is needed
function integrate(f, a, b, depth) {
    if (depth >= 10) {
        return cons(easyintegrate(f, a, b), null)
    }
    mid = (a+b)/2
    return cons(easyintegrate(f, a, b),
        map(addpair)(zip2(integrate(f, a, mid, depth+1), integrate(f, mid, b, depth+1))))
}

function addpair(pair) {
    return pair.a + pair.b
}

function zip2(consas, consbt) {
    if (consas == null || consbt == null) {
        return null
    }
    return cons({a: consas.obj, b:consbt.obj}, zip2(consas.list, consbt.list))
}

console.log("within(0.01, integrate(square, 0, 1, 0))")
console.log(within(0.01, integrate(square, 0, 1, 0)))
console.log()
