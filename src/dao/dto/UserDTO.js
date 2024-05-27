export default class UserDTO{
    constructor(user){
        this.id = user._id
        this.email=user.email
        this.age=parseInt(user.age)
        this.fullName=(user.last_name ? `${user.last_name}` : "") + " " + (user.first_name ? `${user.first_name}` : "")
        this.rol=user.rol
        this.cart = user.cart;
    }
}