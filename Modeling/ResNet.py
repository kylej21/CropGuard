from google.colab import drive
drive.mount('/content/drive')

import os
import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
import torch.optim as optim
from torchvision import models # for resnet
import torchvision.transforms as transforms
import torch.optim as optim
import matplotlib.pyplot as plt

original_dataset_dir =  r"/content/drive/MyDrive/dataset_tenth"
data_path = original_dataset_dir
classes = os.listdir(data_path)
num_classes = len(classes)

def load_dataset(data_path):
    transformation = transforms.Compose([
        transforms.RandomResizedCrop((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
    ])
    full_dataset = torchvision.datasets.ImageFolder(root=data_path, transform = transformation)
    train_size = int(0.8 * len(full_dataset))
    test_size = len(full_dataset) -  train_size
    train_dataset, test_dataset = torch.utils.data.random_split(full_dataset, [train_size, test_size])
    train_loader = torch.utils.data.DataLoader(
                    train_dataset,
                    batch_size= 5,
                    num_workers = 0,
                    shuffle = True)
    test_loader = torch.utils.data.DataLoader(
                    test_dataset,
                    batch_size= 5,
                    num_workers = 0,
                    shuffle = True)
    return train_loader, test_loader

train_loader, test_loader = load_dataset(data_path)
model = models.resnet18(pretrained=True)
model.fc = nn.Linear(model.fc.in_features, num_classes)
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model = model.to(device)

def train(model, device, train_loader, optimizer, epoch):
    model.train()
    train_loss = 0
    print("Epoch:", epoch)
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()
        print(f"target sum {target.sum()}")
        output = model(data)
        print(f"output {output}, output sum = {output.sum()}")
        loss = loss_criteria(output, target)
        train_loss += loss.item()
        loss.backward()
        optimizer.step()
        avg_loss = train_loss / (batch_idx+1)
        print('Training set: Average loss: {:.6f}'.format(avg_loss))
        return avg_loss

def test(model, device, test_loader):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        batch_count = 0
        for data, target in test_loader:
            batch_count += 1
            data, target = data.to(device), target.to(device)
            output = model(data)
            test_loss += loss_criteria(output, target).item()
            _, predicted = torch.max(output.data, 1)
            correct += torch.sum(target==predicted).item()
    avg_loss = test_loss/batch_count
    print('Validation set: Average loss: {:.6f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        avg_loss, correct, len(test_loader.dataset),
        100. * correct / len(test_loader.dataset)))
    return avg_loss
loss_criteria = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

epoch_nums = []
training_loss = []
validation_loss = []
epochs = 200
for epoch in range(1, epochs + 1):
        train_loss = train(model, device, train_loader, optimizer, epoch)
        test_loss = test(model, device, test_loader)
        epoch_nums.append(epoch)
        training_loss.append(train_loss)
        validation_loss.append(test_loss)

model_save_path = "fine_tuned_resnet18.pth"
torch.save(model.state_dict(), model_save_path)
