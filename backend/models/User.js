class User{
    constructor(user_id,user_name,user_password){
        this.user_id=user_id;
        this.user_name=user_name;
        this.user_password=user_password;
        this.favorite_genre='';
    }
    get_user_name(){
        return this.user_name;
    }
    get_user_password(){
        return this.user_password;
    }
    get_favorite_genre(){
        return this.get_favorite_genre
    }
    set_user_name(name){
        this.user_name=name;
    }
    set_user_password(password){
        this.user_password=password;
    }
    set_favourite_genre(favorite_genre){
        this.favorite_genre=favorite_genre
    }
}

export{
    User
}