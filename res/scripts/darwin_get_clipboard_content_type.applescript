property fileTypes : {{«class PNGf», "Image"},{«class HTML», "HTML"},{«class utf8», "Text"}}

set theType to getType()

copy (second item of theType) to stdout

on getType()
  repeat with aType in fileTypes
    repeat with theInfo in (clipboard info)
      if (first item of theInfo) is equal to (first item of aType) then return aType
    end repeat
  end repeat
  return missing value
end getType
