
![gridpaste](http://i.imgur.com/SgA43Vu.png) 

A tool to paste computations, transformations, and structures on a geometric plane.

Gridpaste
=========
Gridpaste is an online mathematics tool to share computations, transformations, and annotations on geometric structures in a coordinate plane. One starts with a clean board and places their geometric elements and performs actions on these elements in a recordable sequence. The sequence may then be saved and shared by a unique URL to colleagues or instructors. The tool is packed with a built-in function runner with annotations and placement of text in an orderly way to present a proof or construction. 


## 2.0 Development

We are currently in the progress of a rewrite in Django/Python3, check status [here](https://github.com/jahan-addison/gridpaste/projects/1).

Requirements
============
    -- IE 9+
    -- Google Chrome
    -- Opera
    -- Mozilla Firefox



Contributing
===
Currently, I'm interested in adding more relatively useful geometric functions to perform on structures. You can see what's available now [here](https://github.com/jahan-addison/gridpaste/blob/master/app/javascripts/board/functions/functions.js). You may also add decorators for either an object in Gridpaste itself or an object in the JSXGraph library. Note that adding a Function object will mean you must also implement a Command object in order for it to be used in the application. 

The signature of the Command interface is as follows:
```
Interface Command {
  public void   constructor(JSXGraph board, Object Arguments)
  public void   remove()
  public object execute()
}
```
Examples of this can be seen [here](https://github.com/jahan-addison/gridpaste/tree/master/app/javascripts/events).

You must then add your unit-tests in `browser_test/function.functions.test.js` and `browser_test/command.function.test.js`, respectively.

Notes
===
Many thanks to the team over at [jsxgraph](http://jsxgraph.uni-bayreuth.de/wp/) for the SVG board library. My inspiration for this application was that there exists many mathematic online tools for analytical, LaTeX sharing such as [Mathb.in](http://mathb.in) but none for geometry.

For any questions or concerns please [open an issue](https://github.com/jahan-addison/gridpaste/issues?state=open) or send to me directly at support [at] gridpaste [dot] io.

License
===
MIT
