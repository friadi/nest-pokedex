import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name ) //Nombre del modelo que queremos usar
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) { //La creacion del modelo en BD son asincronas
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions ( error );
    }

  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({//Ordena de manera ascendente el numero del pokemon
        no : 1
      })
      .select( '-__v' );
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if ( !isNaN (+term) ) { //Si esto es un numero
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoID
    if ( !pokemon && isValidObjectId( term ) ){ // Si no existe un pokemon y es un objectId
      pokemon = await this.pokemonModel.findById( term );
    }

    //Name
    if ( !pokemon ){// Si no existe un pokemon
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }

    if ( !pokemon ) 
    throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne ( term );
    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    try {
      await pokemon.updateOne( updatePokemonDto )
      return { ...pokemon.toJSON(), ... updatePokemonDto };

    } catch (error) {
      this.handleExceptions ( error );
    }
  }

  async remove(id: string) {//Argumentos === id: string
    //const pokemon = await this.findOne( id ); // Consulta
    //await pokemon.deleteOne();
    //return { id };
    //const result = await this.pokemonModel.findByIdAndDelete( id ); // Delete
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return ;
  }

  private handleExceptions(error: any){
    if ( error.code === 11000 ){
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - Ckeck server logs`);  
  }

}
