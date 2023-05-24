import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
// la clase UpdatePokemonDto va a tener todas las mismas condiciones y caract que la clase CreatePokemonDto
