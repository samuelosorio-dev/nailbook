using FluentValidation;
using NailsApi.Application.DTOs.Citas;
using System;
using System.Collections.Generic;
using System.Text;

namespace NailsApi.Application.Validators
{
    public class CitaValidator:AbstractValidator<CitaRequestDto>
    {
        public CitaValidator()
        {
            RuleFor(x => x.ClienteId)
                .GreaterThan(0).WithMessage("Debe seleccionar un cliente");

            RuleFor(x => x.Fecha)
                .NotEmpty().WithMessage("La fecha es obligatoria")
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("La fecha no puede ser en el pasado");

            RuleFor(x => x.HoraInicio)
                .NotEmpty().WithMessage("La hora de inicio es obligatoria");

            RuleFor(x => x.ServiciosIds)
                .NotEmpty().WithMessage("Debe seleccionar al menos un servicio")
                .Must(x => x.Count > 0).WithMessage("Debe seleccionar al menos un servicio")
                .Must(x => x.Distinct().Count() == x.Count)
                .WithMessage("No puede seleccionar el mismo servicio dos veces");
        }
    }
}
