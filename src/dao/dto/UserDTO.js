export default class UserDTO{
    constructor(user){
        this.id = user._id
        this.email=user.email
        this.age=parseInt(user.age)
        this.first_name=user.first_name
        this.last_name=user.last_name
        this.role=user.role
        this.cart = user.cart;
    }
}