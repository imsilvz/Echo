using System;
using System.IO;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Diagnostics;

namespace Echo
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
        }

        private void OnStartup(object sender, StartupEventArgs eventArgs)
        {
            var wnd = new MainWindow();
            wnd.Show();
        }

        private void Application_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            MessageBox.Show("Echo has crashed!\nAn unhandled exception just occurred: " + e.Exception.Message, "Echo - FFXIV Chat Listener", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}
