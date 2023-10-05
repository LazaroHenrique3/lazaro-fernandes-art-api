import { TableCell } from 'pdfmake/interfaces'
import { generateReport } from '../../../shared/services'

//Funções auxiliares
import { TechniqueUtil } from './util'

export const generatePDF = async (filter: string): Promise<Buffer | Error> => {

    try {
        const resultSearchReport = await TechniqueUtil.getAllTechniquesForReport(filter)

        const body = []

        const columnsBody: TableCell[] = []

        const columnsTitle: TableCell[] = [
            { text: 'ID', style: 'columnsTitle' },
            { text: 'Status', style: 'columnsTitle' },
            { text: 'Nome', style: 'columnsTitle' }
        ]

        columnsTitle.forEach(column => columnsBody.push(column))
        body.push(columnsBody)

        for await (const result of resultSearchReport) {
            const rows = []

            rows.push(result.id)
            rows.push(result.status)
            rows.push(result.name)

            body.push(rows)
        }

        const widths = [20, 80, '100%']

        const generatePdf = await generateReport('Técnicas', widths, body)
        return generatePdf
    } catch (error) {
        console.log(error)
        return new Error('Erro ao gerar relatório!')
    }

}
