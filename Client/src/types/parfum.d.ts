interface Parfum {
    _id?: string
    status: string
    fullArticle: string
    smallArticle: string
    originFor: string
    imageLogo: string
    pathOriginImageBottle: string
    pathEssenceImageBottle: string
    parfumesFor: string
    topNotes: string
    heartNotes: string
    baseNotes: string
    smell: string
    nameRus? : string    //Наименование продукта на русском
    nameEng? : string    //Наиенование продукта на Английском
    nameShot? : string   //Краткое наименование 
    status: string      //Наличие, под заказ и т. д.
    description: string //Описание продукта
    productType?: string
}