import { TableCell } from 'pdfmake/interfaces'
import { generateReport } from '../../../shared/services'

//Funções auxiliares
import { CustomerUtil } from './util'

export const generatePDF = async (filter: string, status: string, genre: string, dateOfBirth: string): Promise<Buffer | Error> => {

    try {
        const resultSearchReport = await CustomerUtil.getAllAdminsitratorsForReport(filter, status, genre, dateOfBirth)

        const body = []

        const columnsBody: TableCell[] = []

        const columnsTitle: TableCell[] = [
            { text: 'ID', style: 'columnsTitle' },
            { text: 'Status', style: 'columnsTitle' },
            { text: 'Nome', style: 'columnsTitle' },
            { text: 'Email', style: 'columnsTitle' },
            { text: 'Telefone', style: 'columnsTitle' },
            { text: 'Gênero', style: 'columnsTitle' },
            { text: 'CPF', style: 'columnsTitle' },
        ]

        columnsTitle.forEach(column => columnsBody.push(column))
        body.push(columnsBody)

        for await (const result of resultSearchReport) {
            const rows = []

            rows.push(result.id)
            rows.push(result.status)
            rows.push(result.name)
            rows.push(result.email)
            rows.push(CustomerUtil.formatCellphoneForReport(result.cell_phone))
            rows.push(result.genre)
            rows.push(CustomerUtil.formatCpfForReport(result.cpf))

            body.push(rows)
        }

        const widths = [20, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']

        const generatePdf = await generateReport('Clientes', widths, body)
        return generatePdf
    } catch (error) {
        console.log(error)
        return new Error('Erro ao gerar relatório!')
    }

}




