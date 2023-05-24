import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {//Se recomienda que sea clase para las reglas de negocios

    // id:string // Mongo me lo da
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;

} 

export const PokemonSchema = SchemaFactory.createForClass( Pokemon );
