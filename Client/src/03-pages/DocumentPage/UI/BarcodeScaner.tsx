import React, { useEffect } from 'react'
import Quagga from 'quagga'

interface BarcodeScanerProps {
    onDetected: (barcode: string) => void
}

interface ICodeResult {
    code : string
}


export const BarcodeScaner:React.FC<BarcodeScanerProps> = ({ onDetected }) => {

    useEffect(() => {
        Quagga.init({
            inputStream: {
                type: 'LiveStream',
                constraints: {
                    facingMode: 'environment'
                },
                target: document.querySelector('#scanner-container'),
            },
            decoder: {
                readers: [
                    'code_128_reader', 
                    'ean_reader', 
                    'ean_8_reader', 
                    'code_39_reader', 
                    'code_39_vin_reader', 
                    'codabar_reader', 
                    'upc_reader', 
                    'upc_e_reader',
                ]
            }
        }, (err: unknown) => {
            if (err) {
                console.log('QuaggaJS initialization failed:', err)
                return;
            }
            console.log('QuaggaJS initialization succeeded');
            Quagga.start()
        })

        Quagga.onDetected((data: {codeResult: ICodeResult}) => {
            onDetected(data.codeResult.code)
        })

        return () => {
            Quagga.stop()
        }

    }, [onDetected])

    return (
        <div id='scanner-container' style={{position: 'relative', width: '100%', height: '400px'}}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} />
        </div>
    )
}
