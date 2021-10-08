import { ChunksContext } from 'pages/dashboard/new-selph';
import { useContext } from 'react'

function useRecordingContext() {
    return useContext(ChunksContext);
}

export default useRecordingContext
