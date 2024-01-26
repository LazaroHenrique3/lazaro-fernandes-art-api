import dayjs from 'dayjs'

import { TableCell } from 'pdfmake/interfaces'
import { generateReport } from '../../../shared/services'

//Funções auxiliares
import { SaleUtil } from './util'

export const generatePDF = async (filter: string, status: string, orderDate: string, orderByPrice: string, paymentDueDate: string): Promise<Buffer | Error> => {

    try {
        const resultSearchReport = await SaleUtil.getAllSalesForReport(filter, status, orderDate, orderByPrice, paymentDueDate)

        const body = []

        const columnsBody: TableCell[] = []

        const columnsTitle: TableCell[] = [
            { text: 'ID', style: 'columnsTitle' },
            { text: 'Status', style: 'columnsTitle' },
            { text: 'Cliente', style: 'columnsTitle' },
            { text: 'D. Pedido', style: 'columnsTitle' },
            { text: 'D. Vencimento', style: 'columnsTitle' },
            { text: 'F. Pgto', style: 'columnsTitle' },
            { text: 'F. Envio', style: 'columnsTitle' },
            { text: 'Total', style: 'columnsTitle' }
        ]

        columnsTitle.forEach(column => columnsBody.push(column))
        body.push(columnsBody)

        for await (const result of resultSearchReport) {
            const rows = []

            rows.push(result.id)
            rows.push(result.status)
            rows.push(result.customer_name)
            rows.push(dayjs(result.order_date).format('DD/MM/YYYY'))
            rows.push(dayjs(result.payment_due_date).format('DD/MM/YYYY'))
            rows.push(result.payment_method)
            rows.push(result.shipping_method)
            rows.push(SaleUtil.formattedPrice(result.total + result.shipping_cost))

            body.push(rows)
        }

        const widths = [20, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']

        const generatePdf = await generateReport('Vendas', widths, body)
        return generatePdf
    } catch (error) {
        console.log(error)
        return new Error('Erro ao gerar relatório!')
    }

}
