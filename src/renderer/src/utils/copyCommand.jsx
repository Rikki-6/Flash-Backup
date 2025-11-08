import {IconCopy, IconCheck} from "@tabler/icons-react";
import {TextInput, Select} from "@mantine/core";
import {useEffect, useState} from "react";
import {useClipboard} from "@mantine/hooks";

export default function copyCommand({ name }){
  const [command, setCommand] = useState('')
  const [showTick, setShowTick] = useState(false)
  const [selected, setSelected] = useState('Steam')
  const [instructions, setInstructions] = useState("")

  const clipboard = useClipboard({ timeout: 500 });

  useEffect(() => {
    if (name){
      async function fetchData(){
        const id =  await window.electronAPI.getData('itemData','name', name)
        const appData = await window.electronAPI.getAppData()
        const pythonPath = `${appData}/flash-backup/python/pythonw.exe`

        switch (selected){
          case "Steam":
            setInstructions("Right click on your game inside steam, Open properties and paste this into launch options.")
            setCommand(`${pythonPath} "${appData}/flash-backup/emitRequest.pyw" ${id.rows[0].id} %command%`)
            break
          case "Playnite":
            setInstructions("Right click on your game inside playnite, Click Edit and Scripts and paste this command in any of the 3 sections.")
            setCommand(`Start-Process "${pythonPath} "${appData}/flash-backup/emitRequest.pyw" ${id.rows[0].id}"`)
            break
          case "Shortcut":
            setInstructions("Right click on your shortcut then properties, Copy this command and paste it into the very beginning of 'Target' without removing anything else, you can also change the icon back to how it originally was using the options.")
            setCommand(`${pythonPath} "${appData}/flash-backup/emitRequest.exe" ${id.rows[0].id}`)
            break
        }
      }

      fetchData()
    }
  }, [name, selected])

  useEffect(() => {
    let timer;
    if (showTick){
      timer = setTimeout(() => setShowTick(false), 800)
    }

    return () => clearTimeout(timer);
  }, [showTick])

  return (
    <>
      {selected === "Shortcut" && <h5 style={{textAlign: "center"}}>Disclaimer: This only works with normal shortcuts and won't work with url shortcuts</h5>}
      <p style={{textAlign: "center", fontSize: "0.9rem"}}>{instructions}</p>
      <Select
        value={selected}
        onChange={setSelected}
        allowDeselect={false}
        defaultValue={"Steam"}
        required
        data={['Steam', 'Playnite', 'Shortcut']}
      />
      <TextInput readOnly value={command || ""} style={{paddingTop: "0.5rem"}}
                 rightSection={<CopyIcon showTick={showTick} onClick={() => {setShowTick(true); clipboard.copy(command)} }/>}
      />
    </>
  )
}

function CopyIcon({ showTick, onClick }){
    return showTick ? <IconCheck size={16} style={{cursor: 'pointer'}}/> :
      <IconCopy size={16} style={{ cursor: 'pointer' }} onClick={onClick}/>
}
