using System;
using System.Collections.Generic;

namespace Echo.Core.Models.Settings
{
    public class JobInfoItem
    {
        public string Acronym { get; set; }
        public string BaseJob { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }

        public JobInfoItem() { }
        public JobInfoItem(string acro, string name)
        {
            Acronym = acro;
            Name = name;
        }
        public JobInfoItem(string acro, string baseJob, string name) : this(acro, name)
        {
            BaseJob = baseJob;
        }
        public JobInfoItem(string acro, string baseJob, string name, string color) : this(acro, baseJob, name)
        {
            Color = color;
        }
    }
}
