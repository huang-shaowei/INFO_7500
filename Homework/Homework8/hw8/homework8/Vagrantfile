Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.box_version = "201710.25.0"
  config.vm.provision :shell, path: "vagrant/bootstrap.sh"
  config.vm.provider "virtualbox" do |v|
    v.memory = 4096
  end  
  config.vm.synced_folder ".", "/home/vagrant/homework8"
end
