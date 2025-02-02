import torch
from super_gradients.training import models


# Define class names (must match training)
CLASSES = ['free_parking_space', 'not_free_parking_space', 'partially_free_parking_space']


def yolo_nas_l(image_path):
    model = models.get(
        'yolo_nas_l',
        num_classes=len(CLASSES),
        checkpoint_path='/Users/parth/PycharmProjects/DesignProject/Spotwise-backend/ckpt_best.pth'
    )

    # Set model to evaluation mode and appropriate device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = model.to(device)
    model.eval()
    #
    # Predict on an image
    predictions = model.predict(image_path, conf=0.4)

    # Display and save results
    predictions.save(f'output/output.png')