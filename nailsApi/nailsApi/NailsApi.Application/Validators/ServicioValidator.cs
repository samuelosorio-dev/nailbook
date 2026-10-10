using FluentValidation;
using NailsApi.Application.DTOs.Servicios;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Validators
{
    public class ServicioValidator:AbstractValidator<ServicioRequestDto>
    {
        public ServicioValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio")
                .MaximumLength(150).WithMessage("El nombre no puede superar 150 caracteres");

            RuleFor(x => x.Valor)
                .GreaterThan(0).WithMessage("El valor debe ser mayor a 0")
                .LessThanOrEqualTo(9999999).WithMessage("El valor no puede superar 9,999,999");

            RuleFor(x => x.Tipo)
                .IsInEnum().WithMessage("El tipo de servicio no es válido");

            RuleFor(x => x.Duracion)
                .GreaterThan(0).WithMessage("La duración debe ser mayor a 0 minutos")
                .LessThanOrEqualTo(480).WithMessage("La duración no puede superar 480 minutos (8 horas)");
        }
    }
}
