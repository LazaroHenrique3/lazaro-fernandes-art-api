import { TableCell } from 'pdfmake/interfaces'
import { generateReport } from '../../../shared/services'

//Funções auxiliares
import { DimensionUtil } from './util'

export const generatePDF = async (filter: string): Promise<Buffer | Error> => {

    try {
        const resultSearchReport = await DimensionUtil.getAllDimensionsForReport(filter)

        const body = []

        const columnsBody: TableCell[] = []

        const columnsTitle: TableCell[] = [
            { text: 'ID', style: 'columnsTitle' },
            { text: 'Dimensão', style: 'columnsTitle' }
        ]

        columnsTitle.forEach(column => columnsBody.push(column))
        body.push(columnsBody)

        for await (const result of resultSearchReport) {
            const rows = []

            rows.push(result.id)
            rows.push(result.dimension)

            body.push(rows)
        }

        const widths = [20, '100%']

        const generatePdf = await generateReport('Dimensões', widths, body)
        return generatePdf
    } catch (error) {
        console.log(error)
        return new Error('Erro ao gerar relatório!')
    }

}