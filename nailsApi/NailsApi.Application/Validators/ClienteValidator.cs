using FluentValidation;
using NailsApi.Application.DTOs.Clientes;

namespace NailsApi.Application.Validators
{
    public class ClienteValidator:AbstractValidator<ClienteRequestDto>
    {
        public ClienteValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio")
                .MaximumLength(100).WithMessage("El nombre no puede superar 100 caracteres");

            RuleFor(x => x.Telefono)
                .NotEmpty().WithMessage("El teléfono es obligatorio")
                .MaximumLength(15).WithMessage("El teléfono no puede superar 15 caracteres");

            RuleFor(x => x.Alias)
                .MaximumLength(100).WithMessage("El alias no puede superar 100 caracteres")
                .When(x => x.Alias != null);
        }
    }
}
