# MC-BuildTools
---
### _Commands_:

Argument types:
    FilterList
        A list of filters applied to an image,
        Example: ```invert(),blur(2),opaque()```
    
Filters:
&nbsp;&nbsp;&nbsp;- invert
&nbsp;&nbsp;&nbsp;- greyscale
&nbsp;&nbsp;&nbsp;- sepia
&nbsp;&nbsp;&nbsp;- dither
&nbsp;&nbsp;&nbsp;- opaque
&nbsp;&nbsp;&nbsp;- gaussian(number)
&nbsp;&nbsp;&nbsp;- blur(number)
&nbsp;&nbsp;&nbsp;- normalize(number)
&nbsp;&nbsp;&nbsp;- posterize(number)
            
BlockList
    &nbsp;&nbsp;&nbsp;&nbsp;A list of blocks
    &nbsp;&nbsp;&nbsp;&nbsp;examples: ```brick_block``` or ```50%brick_block,50%nothing```

`!pixel-art <url> <width> <height> <vertical> <filters: FilterList>`
    Creates a pixel art from an image

`!set <x> <y> <z> <block: BlockList> `
    Fills an area
    
`!sphere <radius> <fill: bool> <block: BlockList>`
    Creates a sphere
    
`!circle <radius> <block: BlockList>`
    Creates a circle
    
`!cone <radius> <height> <block: BlockList>`
    Creates a cone
    
`!ellipse <width> <length> <block: BlockList>`
    Creates an ellipse

`!ellipsoid <width> <height> <length> <block: BlockList>`
    Creates an ellipsoid

`!end`
    Stops the execution from the currently running command
    
`!tpcmd`
    TPs to the location of the currently running command
    
`!cmds <page>`
    Logs this list in chat

`!permission <method: "grant" or "revoke"> <player> <command>`
    Grants or revokes a permission from a player