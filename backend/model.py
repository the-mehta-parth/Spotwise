import torch
from super_gradients.training import models
import json

# Define class names (must match training)
CLASSES = ['free_parking_space', 'not_free_parking_space', 'partially_free_parking_space']


def yolo_nas_l(image_path):
    model = models.get(
        'yolo_nas_l',
        num_classes=len(CLASSES),
        checkpoint_path='/home/traskar/dev/projects/Spotwise/backend/ckpt_best.pth'
    )

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = model.to(device)
    model.eval()
    
    # Predict on an image
    image_prediction = model.predict(image_path, conf=0.4)
    #print(image_prediction)

    # Return JSON results
    predictions = {}
    class_names = image_prediction.class_names
    labels = image_prediction.prediction.labels.tolist()
    confidence = image_prediction.prediction.confidence.tolist()
    bboxes = image_prediction.prediction.bboxes_xyxy.tolist()

    for i, (label, conf, bbox) in enumerate(zip(labels, confidence, bboxes)):
        prediction = {
            "label_id": label,
            "label_name": class_names[int(label)],
            "confidence": conf,
            "bbox": bbox
        }
        predictions[i] = prediction

    return predictions

if __name__ == '__main__':
    print(yolo_nas_l('/home/traskar/dev/projects/Spotwise/backend/1.png'))
    