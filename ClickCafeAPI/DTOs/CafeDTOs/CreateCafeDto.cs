﻿namespace ClickCafeAPI.DTOs.CafeDTOs
{
    public class CreateCafeDto
    {
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string OperatingHours { get; set; } = null!;
        public string? Image { get; set; }
    }
}