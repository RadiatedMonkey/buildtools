# Mc BuildTools
---
### _Commands_:

    Argument types:
        FilterList
            A list of filters applied to an image,
            example: invert(),blur(2),opaque()
            
            Filters:
                - invert
                - greyscale
                - sepia
                - dither
                - opaque
                - gaussian(number)
                - blur(number)
                - normalize(number)
                - posterize(number)
                
        BlockList
            A list of blocks
            examples: brick_block or 50%brick_block,50%nothing

    !pixel-art <url> <width> <height> <vertical> <filters: FilterList>

    !set <x> <y> <z> <block: BlockList> 
        Fills an area
        
    !sphere <radius> <fill: bool> <block: BlockList>
        Creates a sphere
        
    !circle <radius> <block: BlockList>
        Creates a circle
        
    !cone <radius> <height> <block: BlockList>
        Creates a cone
        
    !ellipse <width> <length> <block: BlockList>
        Creates an ellipse
    
    !ellipsoid <width> <height> <length> <block: BlockList>
        Creates an ellipsoid
    
    !end
        Stops the execution from the currently running command
        
    !tpcmd
        TPs to the location of the currently running command
        
    !cmds <page>
        Logs this list in chat
    
    !permission <method: "grant" or "revoke"> <player> <command>