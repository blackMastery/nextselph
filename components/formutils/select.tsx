import { SelectMenu } from 'bumbag'
import React, { useEffect, useState } from "react";
import useSelphs from "@/hooks/selph/queries/useSelphs";




export default function SelectSelph({userid}) {
    const [value, setValue] = useState();
    const {
        data: selphs,
        isLoading: selphIsLoading,
        isError: selphIsError,
        isSuccess: selphIsSuccess,
      } = useSelphs({ query: { "user.id": userid } });

const selphNames =  selphs ? selphs.map((s)=>{
    return    {
     value:s.name,
     label: s.name,
     key: s.id
 }
 }): [{
     value:'',
     label: '',
     key: ''
 } ]
  
    return (
      <SelectMenu
        onChange={setValue}
        options={selphNames}
        placeholder="Selphs"
        value={value}
      />
    )
  }