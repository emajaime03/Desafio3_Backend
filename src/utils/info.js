export const invalidId = (id) => {
    return `El ID ${id} no es válido.`
}

export const generateUserErrorInfo = (user) => {
    return `Una o mas propiedades estan incompletas o no son válidas.
    Detalle:
    * Nombre : se necesitaba un nombre de usuario, pero se recibió ${user.name}
    * Apellido : se necesitaba un apellido, pero se recibió ${user.surname}
    * Email : se necesitaba un email, pero se recibió ${user.email}
    `
}

export const generateProductErrorInfo = (product) => {
    return `Una o mas propiedades estan incompletas o no son válidas.
    Detalle:
    * Título : se necesitaba un titulo de producto, pero se recibió ${product.title}
    * Descripcion : se necesitaba una descripción del producto, pero se recibió ${product.description}
    * Precio : se necesitaba un precio del producto, pero se recibió ${product.price}
    * Stock : se necesitaba una cantidad de stock del producto, pero se recibió ${product.stock}
    * Categoria : se necesitaba una categoría del producto, pero se recibió ${product.category}
    * Codigo : se necesitaba un código del producto, pero se recibió ${product.code}
    * Status : se necesitaba un estado del producto, pero se recibió ${product.status}
    `
}

export const generateAddProductCartErrorInfo = () => {
    return `El producto seleccionado no existe o no tiene stock suficiente.`
}

export const generateOrderErrorInfo = () => {
    return `No se pudo completar la orden.`
}