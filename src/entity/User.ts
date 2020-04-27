import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { IsEmail, Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;
  
    @Column()
    @Length(3, 21)
    pseudo: string;
  
    @Column()
    @Length(4, 100)
    password: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
