property fileTypes : {{«class PNGf», ".png"}}

on run argv
  if argv is {} then
    return ""
  end if

  set imagePath to (item 1 of argv)
  set theType to getType()

  if theType is not missing value then		
    try
      set myFile to (open for access imagePath with write permission)
      set eof myFile to 0
      write (the clipboard as (first item of theType)) to myFile
      close access myFile
      copy imagePath to stdout
    on error
      try
        close access myFile
      end try
      return ""
    end try
  else
    copy "no image" to stdout
  end if
end run

on getType()
  repeat with aType in fileTypes
    repeat with theInfo in (clipboard info)
      if (first item of theInfo) is equal to (first item of aType) then return aType
    end repeat
  end repeat
  return missing value
end getType

