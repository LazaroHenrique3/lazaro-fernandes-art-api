import PdfPrinter from 'pdfmake'
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces'

//Fontes que poderão ser usadas nos relatórios
const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
}

export const generateReport = (reportName: string, widths: (number | string)[], body: TableCell[][]): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {

        const printer = new PdfPrinter(fonts)

        //Criando a estrutura do relatório
        const docDefinitions: TDocumentDefinitions = {
            defaultStyle: { font: 'Helvetica' },
            content: [
                {
                    columns: [
                        { text: `Relatório de ${reportName}`, style: 'header' },
                        { text: `${getCurrentDateTime()}\n\n`, style: 'header' }
                    ]
                },
                {
                    table: {
                        heights: function (row) {
                            return 15
                        },
                        widths,
                        body
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                },
                columnsTitle: {
                    fontSize: 13,
                    bold: true,
                    fillColor: '#000000',
                    color: '#1B98E0',
                    alignment: 'center'
                }
            }
        }

        const pdfDoc = printer.createPdfKitDocument(docDefinitions)

        const chunks: Buffer[] = []

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk)
        })

        pdfDoc.on('error', (error) => {
            reject(error)
        })

        pdfDoc.end()

        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks)

            resolve(result)
        })
    })
}

const getCurrentDateTime = (): string => {
    const dataAtual = new Date()

    // Obtém os componentes da data
    const day = String(dataAtual.getDate()).padStart(2, '0')
    const month = String(dataAtual.getMonth() + 1).padStart(2, '0')
    const year = dataAtual.getFullYear()

    // Obtém os componentes da hora
    const hour = String(dataAtual.getHours()).padStart(2, '0')
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0')

    // Formata a data e hora no formato brasileiro
    const formattedDateTime = `${day}/${month}/${year} | ${hour}:${minutos}`

    return formattedDateTime
}