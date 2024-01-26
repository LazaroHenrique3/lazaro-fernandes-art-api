import { TableCell } from 'pdfmake/interfaces'
import { generateReport } from '../../../shared/services'

//Funções auxiliares
import { ProductUtil } from './util'

export const generatePDF = async (
    filter: string,
    status: string,
    type: string,
    orientation: string,
    category: string,
    technique: string,
    dimension: string,
    productionDate: string,
    orderByPrice: string
): Promise<Buffer | Error> => {

    try {
        const resultSearchReport = await ProductUtil.getAllProductsForReport(filter, status, type, orientation, category, technique, dimension, productionDate, orderByPrice)

        const body = []

        const columnsBody: TableCell[] = []

        const columnsTitle: TableCell[] = [
            { text: 'ID', style: 'columnsTitle' },
            { text: 'Título', style: 'columnsTitle' },
            { text: 'Status', style: 'columnsTitle' },
            { text: 'Típo', style: 'columnsTitle' },
            { text: 'Categoria', style: 'columnsTitle' },
            { text: 'Técnica', style: 'columnsTitle' },
            { text: 'Dimensão', style: 'columnsTitle' },
            { text: 'Qtd.', style: 'columnsTitle' },
            { text: 'Preço', style: 'columnsTitle' }
        ]

        columnsTitle.forEach(column => columnsBody.push(column))
        body.push(columnsBody)

        for await (const result of resultSearchReport) {
            const rows = []

            rows.push(result.id)
            rows.push(result.title)
            rows.push(result.status)
            rows.push(result.type)
            rows.push(result.category_id)
            rows.push(result.technique_id)
            rows.push(result.dimension_id)
            rows.push(result.quantity ?? '')
            rows.push(ProductUtil.formattedPrice(result.price ?? ''))

            body.push(rows)
        }

        const widths = [20, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']

        const generatePdf = await generateReport('Produtos', widths, body)
        return generatePdf
    } catch (error) {
        console.log(error)
        return new Error('Erro ao gerar relatório!')
    }

}




