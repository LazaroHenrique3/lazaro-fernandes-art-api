import { TableCell } from 'pdfmake/interfaces'
import { generateReport } from '../../../shared/services'

//Funções auxiliares
import { AdministratorUtil } from './util'

export const generatePDF = async (filter: string, status: string): Promise<Buffer | Error> => {

    try {
        const resultSearchReport = await AdministratorUtil.getAllAdminsitratorsForReport(filter, status)

        const body = []

        const columnsBody: TableCell[] = []

        const columnsTitle: TableCell[] = [
            { text: 'ID', style: 'columnsTitle' },
            { text: 'Status', style: 'columnsTitle' },
            { text: 'Nome', style: 'columnsTitle' },
            { text: 'Email', style: 'columnsTitle' },
        ]

        columnsTitle.forEach(column => columnsBody.push(column))
        body.push(columnsBody)

        for await (const result of resultSearchReport) {
            const rows = []

            rows.push(result.id)
            rows.push(result.status)
            rows.push(result.name)
            rows.push(result.email)

            body.push(rows)
        }

        const widths = [20, 'auto', 150, '56%']

        const generatePdf = await generateReport('Administradores', widths, body)
        return generatePdf
    } catch (error) {
        console.log(error)
        return new Error('Erro ao gerar relatório!')
    }

}




