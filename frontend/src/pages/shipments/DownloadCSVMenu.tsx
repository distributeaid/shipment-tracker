import format from 'date-fns/format'
import { FunctionComponent, useMemo } from 'react'
import Button from '../../components/Button'
import PlainModal from '../../components/modal/PlainModal'
import useModalState from '../../hooks/useModalState'
import {
  ShipmentQuery,
  useExportShipmentToCsvMutation,
  useShipmentWithExportsQuery,
} from '../../types/api-types'

interface Props {
  shipment: ShipmentQuery['shipment']
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL?.replace(/\/$/, '')

const DownloadCSVMenu: FunctionComponent<Props> = ({ shipment }) => {
  const [modalIsVisible, showModal, hideModal] = useModalState()

  const { data: shipmentWithExports } = useShipmentWithExportsQuery({
    variables: { id: shipment.id },
  })
  const shipmentExports = useMemo(
    () => shipmentWithExports?.shipment?.exports ?? [],
    [shipmentWithExports],
  )

  const [exportShipment, { loading: exportIsProcessing }] =
    useExportShipmentToCsvMutation()

  const exportToCSV = async () => {
    const shipmentExport = await exportShipment({
      variables: { shipmentId: shipment.id },
    })
    const downloadPath = shipmentExport.data?.exportShipment.downloadPath

    if (!downloadPath) {
      throw new Error("Unable to download the shipment's data")
    }

    await downloadShipment(downloadPath)
  }

  const downloadShipment = async (downloadPath: string) => {
    const downloadUrl = new URL(downloadPath, SERVER_URL)
    window.open(downloadUrl.href)
  }

  const sortedExports = useMemo(() => {
    const sorted = [...shipmentExports]
    sorted.sort((a, b) => {
      const aValue = new Date(a.createdAt)
      const bValue = new Date(b.createdAt)
      if (aValue > bValue) {
        return -1
      } else if (aValue < bValue) {
        return 1
      }
      return 0
    })
    return sorted
  }, [shipmentExports])

  if (shipmentExports.length === 0) {
    return (
      <Button disabled={exportIsProcessing} onClick={exportToCSV}>
        Export to CSV
      </Button>
    )
  }

  return (
    <>
      <Button onClick={exportToCSV}>Export new CSV</Button>
      <Button onClick={showModal}>Download existing CSV</Button>
      <PlainModal isOpen={modalIsVisible} onRequestClose={hideModal}>
        <div className="p-4 pb-0">
          <h2 className="text-gray-700 text-lg mb-2">Previous versions</h2>
          <p className="text-gray-800">
            You can download versions of this shipment that were exported in the
            past.
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto p-4">
          <div className="divide-y divide-gray-100 pb-2">
            {sortedExports.map((e) => (
              <div
                key={e.id}
                className="py-2 flex items-center justify-between"
              >
                <span>
                  {format(new Date(e.createdAt), 'MMM d, yyyy, H:mm')}
                </span>
                <Button
                  slim
                  disabled={exportIsProcessing}
                  onClick={() => downloadShipment(e.downloadPath)}
                >
                  Export
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PlainModal>
    </>
  )
}

export default DownloadCSVMenu
